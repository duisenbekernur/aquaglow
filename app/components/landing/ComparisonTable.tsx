import {COMPARISON_ROWS} from '~/constants/content';

function Cell({ok}: {ok: boolean}) {
  return <span aria-label={ok ? 'Yes' : 'No'}>{ok ? 'Yes' : '—'}</span>;
}

export function ComparisonTable() {
  return (
    <section className="section" aria-labelledby="compare-h">
      <div className="section__inner">
        <h2 id="compare-h" className="section__title">
          AquaGlow vs ordinary shower head
        </h2>
        <div className="compare-table-wrap" role="region" aria-label="Comparison">
          <table className="compare-table">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">AquaGlow</th>
                <th scope="col">Typical shower head</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td>
                    <Cell ok={row.aquaglow} />
                  </td>
                  <td>
                    <Cell ok={row.ordinary} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
