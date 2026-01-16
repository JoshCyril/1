
The 3 Encryption Options
 * Application-Level (Recommended): The .NET API encrypts specific columns (like Email/ID) before saving. The DB sees only randomized text.
 * Database-Level (Column): Postgres encrypts specific columns during the insert using functions like pgcrypto.
 * Disk-Level (TDE/Storage): The cloud provider or OS encrypts the physical files on the hard drive. Note: This does not protect data if someone logs into the DB.
Quick Feature Comparison
| Feature | 1. App-Level (.NET) | 2. DB-Level (Postgres Column) | 3. Disk-Level (Storage) |
|---|---|---|---|
| Protects Against | DB theft, Malicious DBA, Cloud leaks | DB theft, Cloud leaks | Hard drive theft only |
| Performance Hit | Low (Handled by Web Server) | High (Handled by DB CPU) | Negligible |
| Searchability | None (Needs Blind Indexing) | Limited (Slow) | Full (Normal SQL works) |
| Who sees plain text? | .NET App only | .NET App + DB Admin | Everyone with DB login |
Pros & Cons Table
| Approach | Pros (Advantages) | Cons (Disadvantages) |
|---|---|---|
| 1. Application-Level
(Best Security) | • Zero Knowledge: DB Admins cannot see client data.
• Scalable: Offloads math to the web server.
• Portable: Can change DB vendors easily. | • Hard to Search: Cannot use SQL WHERE or LIKE.
• Key Management: You must manage keys in C#.
• Data Size: Text becomes much longer strings. |
| 2. Database-Level
(Easiest Dev) | • Simple Dev: Minimal changes to C# code.
• Accessible: Admins can decrypt via SQL if needed.
• Granular: Encrypts only what you need. | • Performance: Heavy load on the Postgres server.
• Key Exposure: Keys often visible in query logs.
• Weak vs Admin: Superusers can access data & keys. |
| 3. Disk-Level
(Compliance Only) | • "Set and Forget": Usually just a checkbox (AWS/Azure).
• No Dev Work: No code changes needed.
• Fast: No meaningful performance loss. | • Zero Internal Protection: If an admin logs in, they see everything in plain text.
• False Security: Does not protect against SQL Injection. |
Next Step: Since App-Level encryption makes searching (e.g., "Find user by Email") impossible, would you like an explanation of Blind Indexing to solve that?
