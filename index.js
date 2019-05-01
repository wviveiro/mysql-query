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
        this.select_str = strsql;
        return this;
    }
    from(strsql) {
        this.from_str = strsql;
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
       query = this.get_compiled_select(strsql);

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

       let strsql = `INSERT INTO ${table} (${keys.join(', ')})VALUES(${values.join(', ')})`;

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
               sets.push(`${key} = ${this.escape(data[key])}`);
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

       if (this.where_arr.length > 0) {
            query += ` WHERE ${this.where_arr.join(' AND ')}`;
        }

       if (this.joins.length > 0) {
           query += ` ${this.joins.join(' ')}`;
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
        let strsql = `${jointype} JOIN ${table} ON ${onclause}`;
        this.joins.push(strsql);

        return this;
    }
}

module.exports = Query;
