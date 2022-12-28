//404コンポーネントを表示
import NotFound from '../components/layout/NotFound'
import Layout from '../components/layout/Layout'

export default function NotFoundPage() {
  return (
    <Layout title='ページが見つかりません'>
      <NotFound/>
    </Layout>
  )
}