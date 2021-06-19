<p align="center">
<img src=".github/img/mkt-war-logo.png" alt="Logo" />
</p>

<p align="center">
 
<img alt="License: MIT" src="https://img.shields.io/github/license/adarshaacharya/CodeTreats" />
<img alt="Release" src="https://img.shields.io/github/v/release/PedroMiotti/mkt_war" />

</p>


<p align="center">
Mkt War is a multiplayer trivia game for learning strategic marketing concepts.
</p>

---

<p align="center">
<img src=".github/img/mobile-preview.png" alt="Logo" />
    <p align="center"><em>mobile preview</em></p>
</p>

## 📺 Prerequisites

Before running app locally make sure that you install following things:

-   [MySQL](https://dev.mysql.com/downloads/installer/)
-   [Typescript](https://www.typescriptlang.org/id/download)

## 🚀 Local Development

### Step 1: Clone the repo

```bash
https://github.com/PedroMiotti/mkt_war
```

## Step 2: Install dependencies

```bash

# Install dependencies
$ npm install
```

## Step 3: Setup MySQL

```bash
# Enter MySQL shell
mysql -u [username] -p
```

```bash
# Create database
SOURCE [path to project]/server/src/sql/script_v1.6.sql
```

<strong>OR</strong>

Just run the `script_v1.6.sql` file on mysql workbench.


### Step 3: Configuration

1. Create `.env` file in project root dir

    ```bash
    $ touch .env
    ```

2. Copy everything from `.env.example` as paste it in `.env`
3. Insert your mysql credentials into the DB section
4. Generate hashs for bcrypt and jwt.

## 📝 License

This project is [MIT](https://github.com/adarshaacharya/CodeTreats/blob/master/LICENSE) licensed.