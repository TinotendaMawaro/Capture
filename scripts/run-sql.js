/**
 * Execute SQL in Supabase
 * Run: node scripts/run-sql.js
 */

const { createClient } = require('@supabase/supabase-js')
const https = require('https')
const fs = require('fs')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing environment variables')
  console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

// Read the SQL file
const sql = fs.readFileSync('./sql/init.sql', 'utf8')

console.log('Executing SQL in Supabase...')
console.log('')

// Use the Supabase REST API to execute SQL
const postData = JSON.stringify({
  query: sql
})

const options = {
  hostname: `${supabaseUrl.replace('https://', '')}`,
  path: '/rest/v1/rpc/exec_sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': supabaseServiceKey,
    'Authorization': `Bearer ${supabaseServiceKey}`,
    'Content-Length': Buffer.byteLength(postData)
  }
}

// Note: This won't work directly - we need a different approach
// Let's use the query approach instead

async function executeSQL() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    // Execute the SQL functions using rpc
    // First, let's test if we can call a simple function
    
    console.log('Attempting to create functions...')
    console.log('')
    console.log('NOTE: Due to Supabase security, direct SQL execution requires:')
    console.log('1. Supabase CLI installed, OR')
    console.log('2. Manual execution in Supabase Dashboard SQL Editor')
    console.log('')
    console.log('Please run the following in Supabase SQL Editor:')
    console.log('='.repeat(50))
    console.log(sql)
    console.log('='.repeat(50))
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

executeSQL()
