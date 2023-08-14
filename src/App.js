import { useCallback, useEffect, useRef, useState } from "react";
import { getData } from "./data";
import { debounce } from "./debounce";
import "./styles.css";

/**
 * 注意点：
 * 1.虚拟列表分为三部分：wrapper、empty-box、container
 * - wrapper组件最外层盒子，需要有固定高度和滚动条（overflow:auto），相对定位
 * - empty-box负责撑起整个列表的空盒子，高度=列表项高*单次渲染数量
 * - container列表项容器，绝对定位、top=第一条所在位置*列表项高
 * @param {*} props
 */
const VirtualList = (props) => {
  const { data = [], height, itemHeight } = props;
  const wrapperRef = useRef(null);
  const size = wrapperRef.current?.clientHeight / 20 + 1; //单次渲染数量
  const ITEM_HEIGHT = itemHeight ?? 20;
  const position = useRef(0); //记录第一条数据所在位置

  console.info("position:", position);

  const [renderlist, setList] = useState([]);

  const segmentRender = useCallback(
    (list = []) => {
      if (position.current > data.length) {
        return;
      }

      const start =
        position.current > 0 ? position.current - 1 : position.current;
      const end =
        position.current + size < data.length
          ? position.current + size
          : data.length;

      const tempList = data.slice(start, end);

      console.info("tempList:", tempList);

      setList(tempList);
    },
    [data, size]
  );

  useEffect(() => {
    segmentRender(data);
  }, [data, segmentRender]);

  const debo = debounce(segmentRender, 0.2);

  const handleScroll = (ev) => {
    position.current = Math.floor(ev.target.scrollTop / ITEM_HEIGHT);
    debo(data);
  };

  const virtualListStyle = {
    height: height,
    overflow: "auto"
  };
  const emptyBoxStyle = { height: data.length * ITEM_HEIGHT };
  const containerStyle = {
    top:
      (position.current > 0 ? position.current - 1 : position.current) *
      ITEM_HEIGHT
  };

  return (
    <div
      className="virtual-list"
      style={virtualListStyle}
      onScroll={handleScroll}
      ref={wrapperRef}
    >
      <div className="virturl-list-empty-box" style={emptyBoxStyle}></div>
      <div className="virturl-list-container" style={containerStyle}>
        {renderlist.map((item) => (
          <div key={item} className="virtual-list-item">
            第{item}条数据
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(getData());
  }, []);

  return (
    <div className="App">
      <VirtualList data={list} height={400} />
    </div>
  );
}
