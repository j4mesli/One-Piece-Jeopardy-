import star from '../../assets/star.png';
import "./CategorySelection.css";

interface CategorySelectionProps {
    makeSelection: (category: string) => () => void;
}

function CategorySelection(props: CategorySelectionProps) {

    return (
      <div className="category-selection">
        <h2 className='heading'>Pick a Category</h2>
        <h4 className='heading subcategory' onClick={ props.makeSelection('arcs') }>Arcs 📖:</h4>
        <h5 className='heading'>&nbsp;&nbsp;Difficulty: ⭐</h5>
        <h4 className='heading subcategory' onClick={ props.makeSelection('characters') }>Characters 🦸:</h4>
        <h5 className='heading'>&nbsp;&nbsp;Difficulty: ⭐⭐</h5>
        <h4 className='heading subcategory' onClick={ props.makeSelection('abilities') }>Abilities 💪:</h4>
        <h5 className='heading'>&nbsp;&nbsp;Difficulty: ⭐⭐⭐</h5>
      </div>
    );
  }
  
  export default CategorySelection;