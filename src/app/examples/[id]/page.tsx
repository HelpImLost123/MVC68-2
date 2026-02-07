import ExampleDetail from '@/views/ExampleDetail';

export default function ExampleDetailPage({ params }: { params: { id: string } }) {
  return <ExampleDetail id={params.id} />;
}
