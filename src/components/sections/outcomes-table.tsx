import { Reveal } from "@/components/shared/reveal";
import { OUTCOMES } from "@/lib/content";

/**
 * "From an interest to something you can show." Rendered as a real table on
 * wider screens and as stacked cards on phones, so nothing scrolls sideways.
 */
export function OutcomesTable() {
  return (
    <Reveal>
      <div className="overflow-hidden rounded-card border border-line bg-white">
        <table className="hidden w-full text-left md:table">
          <caption className="sr-only">Learning pathways, what you can practise, and a possible outcome</caption>
          <thead className="bg-surface text-xs text-muted">
            <tr>
              <th scope="col" className="w-1/4 px-6 py-3 font-medium">
                Pathway
              </th>
              <th scope="col" className="w-[38%] px-6 py-3 font-medium">
                What you can practice
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                A possible outcome
              </th>
            </tr>
          </thead>
          <tbody>
            {OUTCOMES.map((row) => (
              <tr key={row.pathway} className="border-t border-line">
                <th scope="row" className="px-6 py-5 text-[0.9375rem] font-medium">
                  {row.pathway}
                </th>
                <td className="px-6 py-5 text-[0.9375rem] text-muted">{row.practice}</td>
                <td className="px-6 py-5 text-[0.9375rem] text-muted">{row.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="divide-y divide-line md:hidden">
          {OUTCOMES.map((row) => (
            <li key={row.pathway} className="p-5">
              <h3 className="text-lg font-semibold">{row.pathway}</h3>
              <dl className="mt-3 space-y-3 text-[0.9375rem]">
                <div>
                  <dt className="text-xs font-medium text-muted">What you can practice</dt>
                  <dd className="mt-0.5">{row.practice}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted">A possible outcome</dt>
                  <dd className="mt-0.5">{row.outcome}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-xs text-muted">
        Illustrative learning outcomes. Topics and opportunities are shared through community updates.
      </p>
    </Reveal>
  );
}
