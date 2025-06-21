const tableHeaders = [
  'survey', 'section', 'section_seq', 'survey_section_ref', 'options', 'option_type',
  'option_seq', 'questions', 'question_type', 'question_option_ref', 'question_section_ref',
  'conditional', 'conditional_source_question', 'tag_name', 'tag_parentId', 'tag_parentName',
  'attribute_name', 'survey_primary_id', 'section_primary_id', 'option_primary_id',
  'question_primary_id', 'survey_reference_id', 'survey_reference_primary_id',
  'survey_section_primary_id', 'section_question_primary_id', 'question_option_primary_id',
  'conditional_question_mapping_primary_id', 'condition_primary_id', 'tag_primary_id',
  'attribute_primary_id', 'attribute_group_id'
];

const recentIds = Array.from({ length: 5 }, (_, i) =>
  Object.fromEntries(tableHeaders.map(h => [h, `${h}_${i + 1}`]))
);

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-500">Welcome to the Dashboard</h1>

      <div>
        <h2 className="text-2xl font-semibold mb-3 text-gray-500">Last 5 ID Records</h2>
        <div className="overflow-auto">
          <table className="w-full bg-white rounded-xl shadow-md border border-gray-200 text-sm">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                {tableHeaders.map(header => (
                  <th key={header} className="p-2 whitespace-nowrap text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentIds.map((record, index) => (
                <tr key={index} className="border-t">
                  {tableHeaders.map(h => (
                    <td key={h} className="p-2 whitespace-nowrap text-gray-700">{record[h]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}