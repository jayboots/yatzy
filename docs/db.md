# Entity Relationship Model

## Entities

- users
- scores
- account_types
- regions

### Entity Relationship Diagram

![Database Schema](/docs/schema.png)

### Attributes Details

#### Users

- User ID (Integer, Primary Key)
- Username ID (String)
- First Name (String)
- Last Name (String)
- Password (String)
- Type ID (Integer, Foreign Key [Account Types])
- Region ID (Integer, Foreign Key [Regions])

#### Scores

- ID (Integer, Primary Key)
- Score (Integer)
- Date (TimeStamp)
- User ID (Integer, Foreign Key [Users])

#### Account Types

- Type ID (Integer, Primary Key)
- Type Description (String)

#### Regions

- Region ID (Integer, Primary Key)
- Region Name (String)


## Schema

### SQL Schema Excerpt

**Note:** see [schema](/db/schema.sql) for a full schema with primary keys and foreign keys.

The below excerpt is just for demonstration purposes.

```sql
-- Table structure for table `account_types`
CREATE TABLE account_types (
    type_id SERIAL NOT NULL,
    type_desc text NOT NULL
);

-- Table structure for table `regions`
CREATE TABLE regions (
    region_id SERIAL NOT NULL,
    region_name text NOT NULL
);

-- Table structure for table `users`
CREATE TABLE users (
    user_id SERIAL NOT NULL,
    username text NOT NULL,
    first_name text NOT NULL,
    last_name text,
    password text NOT NULL,
    type_id integer NOT NULL,
    region_id integer
);

-- Table structure for table `scores`
CREATE TABLE public.scores (
    id SERIAL NOT NULL,
    score integer NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer NOT NULL
);
```

#### Sample Data (SQL INSERT)

Sample insert statements

```sql
INSERT INTO account_types VALUES (2, 'player');
INSERT INTO regions VALUES (9, 'North America');

INSERT INTO users VALUES (3, 'superyatzy', 'John', 'Hasbro', 'yahtzee', 2, 5);
INSERT INTO public.scores VALUES (3, 65, '2024-07-24 20:08:14.717115', 3);
```
