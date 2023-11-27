import "./CategorySelection.css";

interface CategorySelectionProps {
  makeSelection: (category: string) => () => void;
  difficulties: { [key: string]: number };
}

function CategorySelection(props: CategorySelectionProps) {

    return (
      <div className="category-selection">
        <h2 className='heading'>Pick a Category</h2>
        <div className="explanation">
          <h5>How does it work?</h5>
          <p className='heading'>
            Answer each question as it appears.<br />
            Your responses will be evaluated after all three questions are answered.<br />
            The difficulty of each category is indicated by the number of stars.<br />
            The more stars there are, the more points you can earn, with greater difficulty!<br />
          </p>
        </div>
        <div className="subcategory">
          <h4 className='heading' onClick={ props.makeSelection('arcs') }><u>Arcs 📖:</u></h4>
          <h5 className='heading' style={{ cursor: "pointer" }} onClick={ props.makeSelection('arcs') }>&nbsp;&nbsp;Difficulty: {"⭐".repeat(props.difficulties["arcs"])}</h5>
        </div>
        <div className="subcategory">
          <h4 className='heading subcategory' onClick={ props.makeSelection('characters') }><u>Characters 🦸:</u></h4>
          <h5 className='heading' style={{ cursor: "pointer" }} onClick={ props.makeSelection('characters') }>&nbsp;&nbsp;Difficulty: {"⭐".repeat(props.difficulties["characters"])}</h5>
        </div>
        <div className="subcategory">
          <h4 className='heading subcategory' onClick={ props.makeSelection('abilities') }><u>Abilities 💪:</u></h4>
          <h5 className='heading' style={{ cursor: "pointer" }} onClick={ props.makeSelection('abilities') }>&nbsp;&nbsp;Difficulty: {"⭐".repeat(props.difficulties["abilities"])}</h5>
        </div>
      </div>
    );
  }
  
  export default CategorySelection;