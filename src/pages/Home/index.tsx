
import { Component, createRef } from 'preact';
import style from "./style.module.css";

export interface Props {

}
interface vardef {
  type: string;
  name: string;
  isSpread?: boolean;
}
interface Block {
  t: BT;
  iden?: string;
  args?: vardef[];
}
interface BlockLine {
  blocks: Array<Block>;
}
export interface State {
  lines: Array<BlockLine>;
  selectedBlock?: Block;
}

export enum BT {
  F_DEF,
  F_CALL,
  C_LINE
}
export function BT_to_str(bt: BT): string {
  switch (bt) {
    case BT.F_DEF: return "f(x)";
    case BT.F_CALL: return "call";
    case BT.C_LINE: return "//";
    default: return "?";
  }
}

export class Home extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      lines: [
        {
          blocks: [{
            t: BT.C_LINE,
            iden: "Hello World example"
          }]
        },
        {
          blocks: [{
            t: BT.F_DEF,
            iden: "main"
          }]
        },
        {
          blocks: [{
            t: BT.F_CALL,
            iden: "main",
            args: [{
              name: "args",
              type: "string[]",
              isSpread: true
            }]
          }]
        }
      ]
    };
  }
  renderBlock(b: Block) {
    let argsStr: string = undefined;

    if (b.t === BT.F_CALL && b.args) {
      argsStr = "";
      for (let i = 0; i < b.args.length; i++) {
        const a = b.args[i];
        let spread = a.isSpread ? "..." : "";

        if (i === 0) {
          argsStr += `${spread}${a.name}: ${a.type}`;
        } else {
          argsStr += `,${spread}${a.name}: ${a.type}`;
        }
      }
    }

    return <div
      className={style.block}
      onClick={() => {
        this.setState({
          selectedBlock: b
        })
      }}
    >
      {BT_to_str(b.t)}
      {b.iden &&
        <span className={style.block_iden}>{b.iden}</span>
      }
      {argsStr !== undefined &&
        <span>({argsStr})</span>
      }
      { b.t === BT.F_DEF &&
        <span>&#123; ... &#125;</span>
      }

    </div>
  }
  renderBlockLine(l: BlockLine, lineNumber?: number) {
    const blocks = [];
    if (l.blocks) {
      for (const b of l.blocks) {
        blocks.push(this.renderBlock(b));
      }
    }
    const lineRef = createRef<HTMLDivElement>();

    return <div
      ref={lineRef}
      className={style.blockline}
      onWheel={(evt) => {
        evt.preventDefault();
        const t = lineRef.current;
        const d = evt.deltaY;
        t.scrollBy({
          left: d,
          behavior: "smooth"
        });
        // t.scrollLeft += d;
      }}>
      {lineNumber !== undefined &&
        <span className={style.blockline_index}>{lineNumber}</span>
      }
      {blocks}
    </div>
  }
  renderBlockView() {
    const lines = [];
    if (this.state.lines) {
      let i = 0;

      for (const l of this.state.lines) {
        i++;

        lines.push(this.renderBlockLine(l, i));
      }
    }
    return <div className={style.blockview}>
      {lines}
    </div>
  }
  renderBlockActions(b: Block) {
    const result = [];
    switch (b.t) {
      case BT.C_LINE: {
        result.push(<input
          className={style.blockaction}
          value={b.iden}
          onChange={(evt) => {
            const t = evt?.target as HTMLInputElement;

            b.iden = t?.value || "";
            this.forceUpdate();
          }}
        />);
      } break;
      case BT.F_DEF: {
        result.push(<input
          className={style.blockaction}
          value={b.iden}
          onChange={(evt) => {
            const t = evt?.target as HTMLInputElement;

            // replace spaces and handle empty string case
            let v = t?.value?.replace(/\s/g, "_") || "_f";

            //identifiers cannot start with a number
            if (/^\d/.test(v)) {
              v = "_" + v;
            }

            //assign the new content
            b.iden = v;

            //update the render
            this.forceUpdate();
          }}
        />);
      } break;
      case BT.F_CALL: {
        result.push(<input
          className={style.blockaction}
          value={b.iden}
          onChange={(evt) => {
            const t = evt?.target as HTMLInputElement;

            // replace spaces and handle empty string case
            let v = t?.value?.replace(/\s/g, "_") || "_f";

            //identifiers cannot start with a number
            if (/^\d/.test(v)) {
              v = "_" + v;
            }

            //assign the new content
            b.iden = v;

            //update the render
            this.forceUpdate();
          }}
        />);
      } break;
      default: break;
    }
    return result;
  }
  render() {
    return <div class={style.home}>
      <div className={style.editor}>
        <div className={style.actions}>
          {this.state.selectedBlock !== undefined &&
            this.renderBlockActions(this.state.selectedBlock)
          }
        </div>
        {this.renderBlockView()}
        <div className={style.pallette}>
          {this.renderBlock({ t: BT.F_DEF })}
          {this.renderBlock({ t: BT.F_CALL })}
          {this.renderBlock({ t: BT.C_LINE })}
        </div>
      </div>
    </div>
  }
}
