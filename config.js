const {createClient} = supabase
const supabaseUrl = 'https://aoncvkcbhvswooxnbkmm.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmN2a2NiaHZzd29veG5ia21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2MjYyMjksImV4cCI6MjA1MjIwMjIyOX0.XPsgqdRBlPIrqVZZUXZ7KE8wGKmeplBitjlOCvtD0Ec"
const supabaseClient = createClient(supabaseUrl, supabaseKey)
window.supabase = supabaseClient