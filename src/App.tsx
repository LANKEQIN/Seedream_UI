import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { Home } from '@/pages/Home'
import { TextToImage } from '@/pages/TextToImage'
import { ImageToImage } from '@/pages/ImageToImage'
import { SeriesGenerate } from '@/pages/SeriesGenerate'
import { History } from '@/pages/History'
import { Settings } from '@/pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="text-to-image" element={<TextToImage />} />
          <Route path="image-to-image" element={<ImageToImage />} />
          <Route path="series" element={<SeriesGenerate />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
