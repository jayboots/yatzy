# Lab 09: Database design

The students will design their data model to be used
to store information needed for the Assignment #4.
The lab references aspects of the sample
Assignment #4 topic of an `emergency_waitlist`, please
adjust for your application.

## Learning Objectives

* Experience designing databases
* Experience creating ERD/Schemas
* Experience writing SQL

## Resources

* [Postgresql](https://www.postgresql.org)
* [MySQL](https://www.mysql.com)
* [MariaDB](https://mariadb.org)
* [FirebaseDB](https://firebase.google.com/docs/database/)
* [Lucid Chart](https://www.lucidchart.com/)
* [Sketch $$](https://www.sketch.com)

## Tasks

This is an individual lab in your assignment #4 repository.

In the tasks below we will be using a [Postgresql](https://www.postgresql.org)
database, but you are welcome to use any relational database like
[MySQL](https://www.mysql.com) or [MariaDB](https://mariadb.org).

NoSQL database technologies like
[FirebaseDB](https://firebase.google.com/docs/database/)
can be used, and "No"SQL does not mean "No" design or schema :-)

### 1. Set Up Your Database

Create a local postgres database.

```bash
psql -U postgres
postgres> CREATE DATABASE emergency_waitlist;
```

### 2. Set Up Your Project

Create a `/docs` folder and add a placeholder
`/docs/db.md` file.

Create a `/db` folder and add placeholder
`/db/schema.sql` and `/db/seed.sql` files.

From `README.md` add a markdown link to your database design file
`[Database Design](/docs/db.md)`,
`[Database Schema](/db/schema.sql)`, and
`[Sample Data (SQL)](/db/seed.sql)`.

Commit these changes and push to [GitHub](https://github.com/).

### 3. Identify entities

In `[Database Design](/docs/db.md)`
list out all the major types of entities / records
that your application needs to store data against
(hint: review your design system and mock ups)

Commit these changes and push to [GitHub](https://github.com/).

### 4. Relationships (ERD)

Using any tool that supports ERD shapes (boxes and arrows) such as
MS Powerpoint, Google Presentation, [Sketch $$](https://www.sketch.com)
or online tools like [Lucid Chart](https://www.lucidchart.com/)
create a visual diagram showing how entities relate to one another.
Add this file (or a link if an online tool) to your repository within
`/docs`.

Create an image of your ERD diagram
and add it to your `/docs/schema.png`
(other image types are OK).  Reference that image
`![Database Schema]/docs/schema.png`
in your `/docs/db.md` file.

Commit these changes and push to [GitHub](https://github.com/).

### 5. Identify attributes

In `[Database Design](/docs/db.md)`
identify the major attributes and their types
such as integers, decimals, strings, and dates
for each entity identified above.  Compare this
data with your design system and mocks ups to ensure
completeness.

Commit these changes and push to [GitHub](https://github.com/).

### 6. Create a SQL Schema

Translate your ERD into a SQL Schema (for example `CREATE TABLE patients`).
This should be valid SQL (hint: it should run on your applications database, e.g. `emergency_waitlist`).

Commit these changes and push to [GitHub](https://github.com/).

### 5. Create sample data (SQL INSERT)

Create sample data that you can later use for testing.  For example,
`INSERT INTO patients (name, ...) VALUES ('james', ...)`.
This should be valid SQL.

Commit these changes and push to [GitHub](https://github.com/).
