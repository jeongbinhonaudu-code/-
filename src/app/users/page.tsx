import { sampleUsers, ROLE_LABEL, ROLE_PERMISSIONS } from "@/data/users";
import { DataBadge } from "@/components/ui/DataBadge";

export default function UsersPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-3 py-4 sm:px-4 sm:py-6">
      <h1 className="text-xl font-bold text-slate-900">사용자·권한</h1>
      <p className="mt-1 text-sm text-slate-500">
        역할별 권한 체계입니다. 실제 로그인·인증(비밀번호 저장, 세션 만료 등)은 2단계에서 서버·DB와 함께 구현됩니다.
      </p>
      <DataBadge reliability="sample" className="mt-2" />

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {(Object.keys(ROLE_PERMISSIONS) as (keyof typeof ROLE_PERMISSIONS)[]).map((role) => (
          <div key={role} className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-2 text-sm font-bold text-slate-800">{ROLE_LABEL[role]}</h2>
            <ul className="list-disc space-y-1 pl-4 text-xs text-slate-600">
              {ROLE_PERMISSIONS[role].map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">이름</th>
              <th className="px-3 py-2 text-left font-semibold">역할</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sampleUsers.map((u) => (
              <tr key={u.id}>
                <td className="px-3 py-2">{u.name}</td>
                <td className="px-3 py-2">{ROLE_LABEL[u.role]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
