import React, { useEffect, useRef, useState } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import {
  Container as BootstrapContainer,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import { isEmpty, cloneDeep } from "lodash";
import "../../assets/scss/boardcon.scss";
import Column from "../BoardComponent/Column";
import { mapOrder } from "../../util/sort";
import { applyDrag } from "../../util/dragDrop";
import { initialData } from "../../actions/initialData";
import {
  // eslint-disable-next-line no-unused-vars
  fetchBoard,
  createColumn,
  updateBoard,
  updateColumn,
  updateCard,
} from "../../actions/api";
import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";

function BoardCon() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  const [openNewListForm, setOpenNewListForm] = useState(false);
  const toggleOpenNewListForm = () => setOpenNewListForm(!openNewListForm);

  const newListInputRef = useRef(null);

  const [newListTitle, setNewListTitle] = useState("");
  const onNewListTitleChange = (e) => setNewListTitle(e.target.value);

  useEffect(() => {
    const boardDB = initialData.boards.find((board) => board.id === "board-1");
    /* const boardId = "62a228910422ccc16a5579c9";
    fetchBoard(boardId).then((board) => {
      console.log(board);
      setBoard(board);
      setColumns(mapOrder(board.columns, board.columnOrder, "_id"));
    });
  }, []); */

    if (boardDB) {
      setBoard(boardDB);
      //sort columns
      boardDB.columns.sort((a, b) => {
        return (
          boardDB.columnOrder.indexOf(a._id) - boardDB.columnOrder.indexOf(b)
        );
      });
      setColumns(mapOrder(boardDB.columns, boardDB.columnOrder, "_id"));
    }
  }, []);

  useEffect(() => {
    if (newListInputRef && newListInputRef.current) {
      newListInputRef.current.focus();
      newListInputRef.current.select();
    }
  }, [openNewListForm]);

  if (isEmpty(board)) {
    return <div className="not-found">404</div>;
  }

  const onColumnDrop = (dropResult) => {
    let newColumns = cloneDeep(columns);
    newColumns = applyDrag(newColumns, dropResult);

    let newBoard = cloneDeep(board);
    newBoard.columnOrder = newColumns.map((c) => c._id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
    /* Call APi update column order for board */
    // thay 1 truong cu the
    updateBoard(newBoard._id, newBoard).catch(() => {
      setColumns(columns);
      setBoard(board);
    });
  };

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = cloneDeep(columns);

      let currentColumn = newColumns.find((c) => c._id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map((i) => i._id);

      setColumns(newColumns); //update column
      if (dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
        /**
         * Moving cards inside columns
         * Calling api update the cardOrder in column
         */
        updateColumn(currentColumn._id, currentColumn).catch(() => {
          setColumns(columns);
        });
      } else {
        /**
         * Moving cards between columns
         */
        // Calling api update the cardOrder in column
        updateColumn(currentColumn._id, currentColumn).catch(() => {
          setColumns(columns);
        });

        if (dropResult.addedIndex !== null) {
          let currentCard = cloneDeep(dropResult.payload);
          currentCard.columnId = currentColumn._id;
          // Calling api update column in current cards, khi addedIndex khac null
          updateCard(currentCard._id, currentCard);
        }
      }
    }
  };

  const addNewList = () => {
    if (!newListTitle) {
      newListInputRef.current.focus();
      return;
    }

    const newColumnToAdd = {
      boardId: board._id,
      title: newListTitle.trim(),
    };
    // Call Api columns
    createColumn(newColumnToAdd).then((column) => {
      let newColumns = cloneDeep(columns);
      newColumns.push(column);

      let newBoard = { ...board };
      newBoard.columnOrder = newColumns.map((c) => c._id);
      newBoard.columns = newColumns;

      setColumns(newColumns);
      setBoard(newBoard);
      setNewListTitle("");
      toggleOpenNewListForm("");
    });
  };

  const onUpdateListColumn = (newUpdateColumn) => {
    const columnIdUpdater = newUpdateColumn._id;

    let newColumns = cloneDeep(columns);
    const columnIndexUpdater = newColumns.findIndex(
      (i) => i._id === columnIdUpdater
    ); //i = items

    if (newUpdateColumn._destroy) {
      newColumns.splice(columnIndexUpdater, 1);
    } else {
      newColumns.splice(columnIndexUpdater, 1, newUpdateColumn);
    }

    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c._id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
  };

  return (
    <div className="app-column-board">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={(index) => columns[index]}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: "column-drop-view",
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column
              column={column}
              onCardDrop={onCardDrop}
              onUpdateListColumn={onUpdateListColumn}
            />
          </Draggable>
        ))}
      </Container>
      <BootstrapContainer className="merres-b4-container">
        {!openNewListForm && (
          <Row>
            <Col className="add-new-column" onClick={toggleOpenNewListForm}>
              <PlusOutlined className="mui-icon" /> Add another list
            </Col>
          </Row>
        )}
        {openNewListForm && (
          <Row>
            <Col className="enter-new-column">
              <Form.Control
                className="input-box"
                size="sm"
                type="text"
                placeholder="Add text..."
                ref={newListInputRef}
                value={newListTitle}
                onChange={onNewListTitleChange}
                onKeyDown={(e) => e.key === "Enter" && addNewList()}
              />
              <Button variant="outline-success" size="sm" onClick={addNewList}>
                Add list
              </Button>
              <span
                className="cancel-adding-new-column-icon"
                onClick={toggleOpenNewListForm}
              >
                <CloseCircleOutlined />
              </span>
            </Col>
          </Row>
        )}
      </BootstrapContainer>
    </div>
  );
}

export default BoardCon;
