This is a staterpack full nextjs crud combine with supabase and jwt for authentication and role management in nextjs.

Tutorial for basic using supabase, you can check youtube :).

## Getting Started

This, sample how to learn simple :

### Crud Nextjs + JWT (Json Web Token) + Layouting/Templating + Role Management (RBAC - ACL) (Comming Soon) + V2L ( Verify Email ) With OTP Nodemailer ( if field users tow_factor : true )

First, install package:

```bash
npm install
# or
yarn install
# or
etc
```

After install, run the development server:

```bash
npm run dev
# or
yarn dev
# or
etc
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start add enviroment file.

```bash
BASE_URL=http://localhost:3000
SUPABASE_URL=
SUPABASE_KEY=
HOST_EMAIL=
PORT_EMAIL=
SECURE_EMAIL=
USER_EMAIL=
PASS_EMAIL=
FROM_EMAIL=
```

After create enviroment, create file supabase.js in root folder.

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

export default supabase;
```

And Open [Supabase](https://supabase.com/)

1. Check folder database
2. Open **SQL Editor** in supabase, and paste one by one sql in folder database
3. Go, **Authentication** in supabase and open **Policies**, create All Policies after all database successfully create
   - Click **New Policy**
   - For full customization
   - Policy name : Policy for access crud ( up to you )
   - Allowed operation : ALL 
   - Target roles : default
   - USING Expresion : true
   - WITH CHECK expression : true
4. Go, Storage and Create New Bucket Name : **users**
   - In Configuration click **Policies**
   - Click **New Policy**
   - Policy name : Policy for access crud ( up to you )
   - Allowed Operation Checked **Select, Insert, Update, Delete**
5. Go Menu **SQL Editor** and create all function, if you want to see function successfuly created, you can go, **Database** and click **Function** for function query check folder function. and import csv base data you can click **Table Editor** click table you want, click **Insert** and **Import data from CSV** for csv, you can check in folder database.
