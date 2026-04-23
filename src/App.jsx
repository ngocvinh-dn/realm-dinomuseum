import { useEffect } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  useEffect(() => {
    async function test() {
      const { data, error } = await supabase
        .from('eras')
        .select('*')

      console.log('DATA:', data)
      console.log('ERROR:', error)
    }

    test()
  }, [])

  return <h1>Hello Dino 🦖</h1>
}

export default App