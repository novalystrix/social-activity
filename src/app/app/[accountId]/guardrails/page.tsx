export const dynamic = "force-dynamic";
import GuardrailsUI from '@/components/GuardrailsUI';

interface Props {
  params: Promise<{ accountId: string }>;
}

export default async function GuardrailsPage({ params }: Props) {
  const { accountId } = await params;
  return <GuardrailsUI accountId={accountId} />;
}
