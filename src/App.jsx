import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout'
import { ToastHost } from './components/overlays'
import Home from './pages/Home'
import Recommend from './pages/Recommend'
import MenuDetail from './pages/MenuDetail'
import Fridge from './pages/Fridge'
import FridgeClear from './pages/FridgeClear'
import Cooking from './pages/Cooking'
import Delivery from './pages/Delivery'
import Guest from './pages/Guest'
import Planner from './pages/Planner'
import Shopping from './pages/Shopping'
import Saved from './pages/Saved'
import My from './pages/My'
import { Preferences, IngredientPreference } from './pages/Preferences'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recommend/:mode" element={<Recommend />} />
        <Route path="/menu/:id" element={<MenuDetail />} />
        <Route path="/fridge" element={<Fridge />} />
        <Route path="/fridge/clear" element={<FridgeClear />} />
        <Route path="/cooking" element={<Cooking />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/guest" element={<Guest />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/planner/shopping" element={<Shopping />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/my" element={<My />} />
        <Route path="/my/preferences" element={<Preferences />} />
        <Route path="/my/preferences/:id" element={<IngredientPreference />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastHost />
    </Layout>
  )
}
