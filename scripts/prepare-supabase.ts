import { readFileSync,writeFileSync } from 'node:fs';
import { seedItems,defaultSettings } from '../lib/seed.ts';
const quote=(s:string)=>"'"+s.replaceAll("'","''")+"'";
let sql=readFileSync('supabase/schema.sql','utf8');
for(const item of seedItems)sql+='\ninsert into public.content(id,slug,kind,payload) values ('+[item.id,item.slug,item.kind,JSON.stringify(item)].map(quote).join(',')+') on conflict (id) do nothing;\n';
sql+='\ninsert into public.settings(id,payload) values (\'business\','+quote(JSON.stringify(defaultSettings))+') on conflict (id) do nothing;\n';
writeFileSync('supabase/setup.sql',sql);
console.log('Supabase setup.sql generated with schema, storage and sample content.');
