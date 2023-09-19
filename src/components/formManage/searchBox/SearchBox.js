import styled from '../../../styles/components/formManage/searchBox/SearchBox.module.css';
import SearchItem from './components/SearchItem.js';
import { AiOutlineSearch } from 'react-icons/ai';

export default function SearchBox({ searchOptions }) {

  return (
    <div className={styled.search_box_container}>
      <div className={styled.search_options_container}>
        {searchOptions.map((ele, index) => {
          return (
            <SearchItem
              key={index}
              asset2={ele.asset2}
              asset1={ele.asset1}
              data={ele.data}
            ></SearchItem>
          );
        })}
      </div>
      <div className={styled.search_icon_box}>
        <AiOutlineSearch />
      </div>
    </div>
  );
}
