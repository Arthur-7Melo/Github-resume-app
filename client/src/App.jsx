import { useState } from "react"
import { fetchRepoInsights } from './services/api'
import Form from "./components/Form"
import LanguageChart from "./components/LanguageChart"
import StatsCard from "./components/StatsCard"
import InsightsText from "./components/InsightsText"
import Header from "./components/Header"
import Footer from "./components/Footer"

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInsights = async repo => {
    setLoading(true);
    try {
      const result = await fetchRepoInsights(repo);
      setData(result);
    } catch (err) {
      console.error(err);
      setError('Falha ao buscar insights. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-8rem)] dark:bg-gray-900">
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard de Insights Github</h2>

          <Form onSubmit={fetchInsights} />

          {loading && (
            <p className="text-gray-500 loading-dots">Carregando dados</p>
          )}

          {error && (
            <p className="text-red-600">{error}</p>
          )}

          {data && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <StatsCard label="Commits na última semana" value={data.commits_last_week} />
                <StatsCard label="Estrelas" value={data.stars} />
              </div>
              <LanguageChart data={data.top_languages} />
              <InsightsText text={data.insights} />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default App

