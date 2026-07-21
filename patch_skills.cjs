const fs = require('fs');
let code = fs.readFileSync('src/components/Skills.tsx', 'utf8');

// 1. Fix syntax error
code = code.replace(
`              </Dialog>
              </div>
          </div>
        </div>
      </section>`,
`              </Dialog>
              </div>
          </div>
        </div>
      </div>
    </section>`
);

// 2. Add XWingScene import
code = code.replace(
`import R2D2 from "./R2D2";
import StackIcon from "tech-stack-icons";`,
`import R2D2 from "./R2D2";
import XWingScene from "./XWing";
import StackIcon from "tech-stack-icons";`
);

// 3. Make stacked modules invisible unless animating
code = code.replace(
`                    return (
                      <div 
                        key={module.id}
                        className="absolute"
                        style={{ 
                          bottom: rowIndex * GRID_CONSTANTS.ROW_HEIGHT, 
                          left: colIndex * GRID_CONSTANTS.STUD_WIDTH,
                          zIndex: rowIndex * 10
                        }}
                      >`,
`                    return (
                      <div 
                        key={module.id}
                        className="absolute transition-opacity duration-300"
                        style={{ 
                          bottom: rowIndex * GRID_CONSTANTS.ROW_HEIGHT, 
                          left: colIndex * GRID_CONSTANTS.STUD_WIDTH,
                          zIndex: rowIndex * 10,
                          opacity: startRect ? 1 : 0
                        }}
                      >`
);

// 4. Add XWingScene above the base
code = code.replace(
`              </div>

              <LegoBlock`,
`              </div>

              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] pointer-events-none z-30">
                <XWingScene progress={equippedModules.length / MODULES.length} />
              </div>

              <LegoBlock`
);

fs.writeFileSync('src/components/Skills.tsx', code);
