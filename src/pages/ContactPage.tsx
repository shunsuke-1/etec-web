import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="お問い合わせ"
        subtitle="ご意見・不具合報告はこちら"
        showBackButton
        backTo="/"
      />

      <Card>
        <CardHeader>
          <CardTitle>連絡先</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <p>
            不具合報告・改善提案・その他のお問い合わせは、以下までご連絡ください。
          </p>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="font-medium text-gray-900">Email</p>
            <p>support@example.com</p>
          </div>
          <p className="text-xs text-gray-500">
            返信にはお時間をいただく場合があります。あらかじめご了承ください。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
