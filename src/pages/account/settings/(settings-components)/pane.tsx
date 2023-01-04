import Router from "next/router";

const ButtonSubPane: React.FC<{
  copytext: string, 
  button?: {copytext: string, href: string, action?: () => void},
}> = (props) => {

  return (
    <div key={props.copytext}>
      <div className="justify-between w-full sm:inline-flex pl-1 py-2">

        {/* Left Child */}
        <div className={`self-center mb-4 ${props.button != undefined ? "sm:w-1/2" : ""}`}> 
          <p className="text-sm font-light dark:text-slate-200 text-ellipsis max-w-md">{props.copytext}</p>
        </div>

        {/* Right Child - Button */}
        {props.button &&
        <div className=""> 
          <button className="px-4 py-2 rounded-3xl dark:bg-slate-400 shadow-md "
                  onClick={() => 
                    props.button?.action != undefined
                      ? props.button.action()
                      : Router.push(props.button?.href?? "#")}>
            {props.button.copytext}
          </button>
        </div>
        }

      </div>
    </div>
  );
}

const Pane: React.FC<{ 
  title: string, 
  subPanes: Array<{ 
    copytext?: string, 
    button?: { copytext: string, href: string},
    element?: JSX.Element 
  }>,
}> = (props) => {
  return (
    <div className="py-2 px-2 mt-2 dark:border-gray-600 border-[0.5px] rounded-md shadow-sm">
      {/* Pane Header */}
      <div className="pb-2 pl-1 mb-2 border-b-[0.5px] dark:border-b-slate-600">
        <h1 className="text-md font-semibold dark:text-slate-200">{props.title}</h1>
      </div>

      {/* Pane Body */}
      <div>
        {props.subPanes.map(e => 
          e.copytext != undefined // Those with copytext can apply the copytext/copytext + button layout
            ? <ButtonSubPane copytext={e.copytext} button={e.button} />
            : e.element // Without copytext -> Custom subpane
        )}
      </div>
    </div>
  );
}

export default Pane;