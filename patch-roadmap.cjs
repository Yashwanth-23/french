const fs = require('fs');
const path = require('path');

const roadmapPath = path.join(__dirname, 'src', 'components', 'RoadmapView.tsx');
let content = fs.readFileSync(roadmapPath, 'utf8');

content = content.replace(
  `<div className="text-[11px] font-bold text-emerald-400 mb-1">Active Output Goal</div>
                        <p className="text-xs text-slate-300">
                          {m.activeOutputMilestone}
                        </p>`,
  `<div className="text-[11px] font-bold text-emerald-400 mb-1">Active Output Requirements</div>
                        <ul className="text-xs text-slate-300 space-y-1">
                          {m.activeRequirements.map((req: string, rIdx: number) => (
                            <li key={rIdx} className="flex items-center space-x-1.5">
                              <span className="text-emerald-500 font-bold">✓</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>`
);

fs.writeFileSync(roadmapPath, content, 'utf8');
console.log('Successfully updated RoadmapView.tsx with activeRequirements!');
