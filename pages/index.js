import Head from 'next/head'
import { useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [ingredients, setIngredients] = useState('')
  const [recipe, setRecipe] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt: `¿Qué receta puedo hacer con ${ingredients}?`,
        max_tokens: 3000,
        n: 1,
        stop: null
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        }
      })

      const recipeText = response.data.choices[0].text.trim()
      setRecipe(recipeText)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Head>
        <title>Recomendador de Recetas</title>
        <meta name="description" content="Obtén sugerencias de recetas basadas en los ingredientes que tienes en casa." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.3/css/bulma.min.css" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </Head>

      <main className="section">
        <div className="container">
          <h1 className="title has-text-centered">Recomendador de Recetas</h1>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Ingredientes en tu refrigerador:</label>
              <div className="control">
                <input className="input" type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="ej. arroz, pollo, brócoli" />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <button className={`button is-primary ${isLoading ? 'is-loading' : ''}`} type="submit">Buscar Receta</button>
              </div>
            </div>
          </form>
          {recipe && (
            <div className="content">
              <h2>Receta recomendada:</h2>
              <pre>{recipe}</pre>
            </div>
          )}
          {!recipe && (
            <div className="content">
              <p>Ingresa los ingredientes que tienes en tu refrigerador y te sugeriremos una receta.</p>
              <p>Puedes ingresar varios ingredientes separados por comas, como por ejemplo: arroz, pollo, brócoli.</p>
              <p>Recuerda que las recetas sugeridas pueden incluir ingredientes adicionales a los que ingresaste.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
