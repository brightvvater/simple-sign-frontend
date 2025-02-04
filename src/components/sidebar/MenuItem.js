import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styled from '../../styles/components/sidebar/MenuItem.module.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useApprovalBox } from '../../contexts/ApprovalBoxContext';
import { usePage } from '../../contexts/PageContext';
import { useLocation } from 'react-router-dom';
import ViewCount from '../approvalBox/viewDocuments/ViewCount';
import getDocView from '../../apis/approvalBoxAPI/getDocView';

function MenuItem({ item, isSubMenuVisible, toggleSubMenu }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { state: pageState, setState: setPageState } = usePage();

  const { customBoxViewItemState, setCustomBoxViewItemState } =
    useApprovalBox();
  const { state, setState, count, setCount } = useApprovalBox();
  const navigate = useNavigate();
  const [clickStates, setClickStates] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const viewItemMapping = {
    상신내역: 'send',
    미결내역: 'pend',
    '기결내역-종결': 'end',
    '기결내역-진행': 'progress',
    수신참조내역: 'reference',
    반려내역: 'reject',
  };
  useEffect(() => {
    switch (currentPath) {
      case '/ABV':
        setPageState((prevState) => ({
          ...prevState,
          isApprovalBox: true,
        }));
        break;
      default:
        setPageState((prevState) => ({
          ...prevState,
          isApprovalBox: false,
        }));
        break;
    }
  }, [currentPath, setPageState]);

  useEffect(() => {
    if (!isSubMenuVisible[item.id - 1]) {
      // isSubMenuVisible이 false일 때, 모든 clickStates를 false로 초기화
      setClickStates(Array(clickStates.length).fill(false));
    }
  }, [isSubMenuVisible]);

  const clickMenu = (index, name) => {
    setPageState((prevState) => ({
      ...prevState,
      curPage: name,
    }));

    setState((prevState) => ({
      ...prevState,
      view: false,
      radioSortValue: 'alldoc',
      shouldFetchDocs: false,
    }));

    const customBoxNames = customBoxViewItemState.map(
      (box) => box.approvalBoxName
    );
    const updateClickStates = clickStates.map((state, i) =>
      i === index ? true : false
    );
    if (name === '기안양식관리') {
      setPageState((prevState) => ({
        ...prevState,
        isApprovalBox: false,
      }));
      navigate(`/EAM?name=${name}`);
    } else if (name === '문서채번관리') {
      setPageState((prevState) => ({
        ...prevState,
        isApprovalBox: false,
      }));
      navigate(`/SAM?name=${name}`);
    } else if (name === '결재함설정') {
      navigate(`/ABS?name=${name}`);
    } else if (name === '상신문서') {
      setState((prevState) => ({
        ...prevState,
        selectSortDate: '기안일',
      }));
      navigate(`/ABV?viewItems=send&name=${name}`);
    } else if (name === '임시보관문서') {
      setState((prevState) => ({
        ...prevState,
        selectSortDate: '작성일',
      }));
      navigate(`/ABV?viewItems=tempor&name=${name}`);
    } else if (name === '미결문서') {
      setState((prevState) => ({
        ...prevState,
        selectSortDate: '도착일',
      }));
      navigate(`/ABV?viewItems=pend&name=${name}`);
    } else if (name === '기결문서') {
      setState((prevState) => ({
        ...prevState,
        selectSortDate: '결재일',
      }));
      navigate(`/ABV?viewItems=concluded&name=${name}`);
    } else if (name === '수신참조문서') {
      setState((prevState) => ({
        ...prevState,
        selectSortDate: '기안일',
      }));
      navigate(`/ABV?viewItems=reference&name=${name}`);

      async function fetchDocViewAndNavigate() {
        try {
          const response = await getDocView();
          setState((prevState) => ({ ...prevState, docView: response.data }));
        } catch (error) {
          console.error('Error retrieving document view:', error);
        }
      }

      fetchDocViewAndNavigate(); // 비동기 함수 호출
    } else {
      setState((prevState) => ({
        ...prevState,
        selectSortDate: '기안일',
      }));
    }

    if (customBoxNames.includes(name)) {
      const matchedBox = customBoxViewItemState.find(
        (box) => box.approvalBoxName === name
      );
      const matchedViewItems = matchedBox ? matchedBox.viewItems : [];

      const transformedViewItems = matchedViewItems.map(
        (item) => viewItemMapping[item] || item
      );

      //viewItems 배열을 콤마로 구분된 문자열로 전환
      const viewItemsString = transformedViewItems.join(',');
      navigate(`/ABV?viewItems=${viewItemsString}&name=${name}`);
    }
  };

  return (
    <List className={styled.list}>
      <ListItemButton
        className={`${styled.mainmenu} ${
          isSubMenuVisible[item.id - 1] ? styled.color : ''
        }`}
        onClick={() => {
          toggleSubMenu(item.id);
        }}
      >
        <ListItemText
          primary={item.name}
          className={styled.menutext}
          style={{ margin: 0 }}
        />
        {isSubMenuVisible[item.id - 1] ? (
          <KeyboardArrowDownIcon htmlColor="#fff;" />
        ) : (
          // <KeyboardArrowDownIcon htmlColor="#3bafda;" />
          // <KeyboardArrowRightIcon htmlColor="#6e768e" />
          <KeyboardArrowRightIcon htmlColor="#fff" />
        )}
      </ListItemButton>

      {item.submenu && isSubMenuVisible[item.id - 1] && (
        <div className={styled.submenu}>
          {item.submenu.map((subitem, index) => (
            <ListItemButton
              key={subitem.id}
              className={`${styled.subitem} ${
                clickStates[index] ? styled.color : ''
              }`}
              onClick={() => {
                clickMenu(index, subitem.name);
                setState((prevState) => ({ ...prevState, searchInput: '' }));
              }}
            >
              <div className={styled.subItemContainer}>
                <ListItemText
                  primary={subitem.name}
                  className={styled.sub_menutext}
                ></ListItemText>
                {subitem.name === '상신문서' && (
                  <ViewCount count={count.sendCount} />
                )}
                {subitem.name === '미결문서' && (
                  <ViewCount count={count.pendCount} />
                )}
                {subitem.name === '기결문서' && (
                  <ViewCount count={count.concludedCount} />
                )}
                {subitem.name === '수신참조문서' && (
                  <ViewCount count={count.referenceCount} />
                )}
              </div>
            </ListItemButton>
          ))}
        </div>
      )}
    </List>
  );
}

export default MenuItem;
