import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="運営者情報"
        subtitle="ETEC Quiz について"
        showBackButton
        backTo="/"
      />

      <Card>
        <CardHeader>
          <CardTitle>サービス概要</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm leading-relaxed text-gray-700">
          <p>
            ETEC Quiz は、エンベデッドシステムスペシャリスト試験対策のための学習サービスです。
          </p>
          <p>
            模擬試験と復習機能を通じて、継続的に弱点を把握しながら学習を進めることを目的としています。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>運営情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-700">
          <p>運営者: ETEC Quiz Team</p>
          <p>提供地域: 日本</p>
          <p>最終更新日: 2026年2月12日</p>
        </CardContent>
      </Card>
    </div>
  );
}
