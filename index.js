/**
 * Create queries Codeigniter style
 *
 * @author Wellington Viveiro <wviveiro@gmail.com>
 **/

class Query {
    constructor(db) {
        this.db = db;
        this.query = db.query;
        this.escape = require('mysql').escape;
        this.end = db.end;
        this.select = this.select.bind(this);
        this.from = this.from.bind(this);
        this.order_by = this.order_by.bind(this);
        this.group_by = this.group_by.bind(this);
        this.where = this.where.bind(this);
        this.get = this.get.bind(this);
        this.insert = this.insert.bind(this);
        this.update = this.update.bind(this);
        this.join = this.join.bind(this);
        this.delete = this.delete.bind(this);
        this.get_compiled_select = this.get_compiled_select.bind(this);
        this.clear();
    }
    clear() {
       this.select_str = null;
       this.where_arr = [];
       this.from_str = null;
       this.order_by_str = null;
       this.group_by_str = null;
       this.joins = [];
    }
    select(strsql) {
        this.select_str = this.escape_select_fields(strsql);
        return this;
    }
    from(from) {
        this.from_str = this.escape_fields(from);
        return this;
    }
    order_by(strsql) {
        this.order_by_str = strsql;
        return this;
    }
    group_by(strsql) {
        this.group_by_str = strsql;
        return this;
    }
   where(field, value, escape) {
       let strsql = `${field}`;
       if (field.indexOf(' ') === -1) {
           strsql +=  ` =`;
       }
       if (value !== undefined) {
           if (escape !== false) value = this.escape(value);
           strsql += ` ${value}`;
       }
       this.where_arr.push(strsql);
       return this;
    }
    async get(strsql) {
       const query = this.get_compiled_select(strsql);

       try {
           return await this.db.query(query);
       } catch (err) {
           console.error(err);
       }
       
    }
    async insert(table, data) {
       const values = [];
       const keys = [];

       for (let key in data) {
           if (data.hasOwnProperty(key)) {
               values.push(this.escape(data[key]));
               keys.push(key);
           }
       }

       let strsql = `INSERT INTO ${table} (\`${keys.join('`, `')}\`)VALUES(${values.join(', ')})`;

       this.clear();
       try {
           return await this.query(strsql);
       } catch (err) {
           console.error(err);
       }
    }
    async update(table, data) {
       const sets = [];
       for (let key in data) {
           if (data.hasOwnProperty(key)) {
               sets.push(`\`${key}\` = ${this.escape(data[key])}`);
           }
       }

       let strsql = `UPDATE ${table} SET ${sets.join(', ')}`;

       if (this.where_arr.length > 0) {
           strsql += ` WHERE ${this.where_arr.join(' AND ')}`;
       }

       this.clear();

       try {
           return await this.query(strsql);
       } catch (err) {
           console.error(err);
       }
    }
    get_compiled_select(strsql) {
        if (strsql) this.from(strsql);

       if (this.select_str === null) this.select_str = '*';
       
       let query = `SELECT ${this.select_str} FROM ${this.from_str}`;

       if (this.joins.length > 0) {
           query += ` ${this.joins.join(' ')}`;
       }

       if (this.where_arr.length > 0) {
            query += ` WHERE ${this.where_arr.join(' AND ')}`;
        }

       if (this.group_by_str !== null) {
           query += ` GROUP BY ${this.group_by_str}`;
       }

       if (this.order_by_str !== null) {
           query += ` GROUP BY ${this.order_by_str}`;
       }

       this.clear();

       return query;
    }
    join(table, onclause, jointype) {
        jointype = (jointype || 'INNER').toUpperCase();
        let strsql = `${jointype} JOIN ${this.escape_fields(table)} ON ${onclause}`;
        this.joins.push(strsql);
        

        return this;
    }
    async delete(table) {
        let strsql = `DELETE FROM ${table}`;

       if (this.where_arr.length > 0) {
           strsql += ` WHERE ${this.where_arr.join(' AND ')}`;
       }

       this.clear();

       try {
           return await this.query(strsql);
       } catch (err) {
           console.error(err);
       }
    }
    escape_select_fields(fields) {
        fields = fields.split(',').map(this.escape_fields);

    
        return fields.join(', ');
    }
    escape_fields(f) {
        f = f.replace(/\s\s+/g, ' ').trim();

        if (f.indexOf('(') > -1 || f.indexOf(')') > -1 || f.indexOf("'") > -1 || f.indexOf('`') > -1) {
            return f;
        }  

        let alias = null;
        let offset;

        // Get alias
        if ((offset = f.toUpperCase().lastIndexOf(' AS ')) > -1) {
            alias = f.substr(offset + 4);
        } else if ((offset = f.toUpperCase().lastIndexOf(' ')) > -1) {
            alias = f.substr(offset + 1);
        }

        if (alias) {
            f = f.substr(0, offset);
        }  

        f = "`" + f + "`";

        f = f.replace(/\./g, "`.`");

        if (alias) {
            f = f + " AS " + "`" + alias + "`";
        }

        return f;
    }
}

module.exports = Query;
