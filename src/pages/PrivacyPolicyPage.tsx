import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="プライバシーポリシー"
        subtitle="個人情報の取り扱いについて"
        showBackButton
        backTo="/"
      />

      <Card>
        <CardHeader>
          <CardTitle>1. 取得する情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm leading-relaxed text-gray-700">
          <p>本サービスでは、アカウント登録時にメールアドレスなどの情報を取得します。</p>
          <p>また、学習履歴や解答結果など、サービス提供に必要な利用データを保存します。</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. 利用目的</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm leading-relaxed text-gray-700">
          <p>取得した情報は、ログイン機能、履歴表示、復習機能の提供に利用します。</p>
          <p>サービス改善や不正利用防止のため、統計的に分析することがあります。</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. 第三者提供・管理</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm leading-relaxed text-gray-700">
          <p>法令に基づく場合を除き、本人の同意なく第三者へ個人情報を提供しません。</p>
          <p>情報は適切な安全対策を講じて管理します。</p>
        </CardContent>
      </Card>
    </div>
  );
}
