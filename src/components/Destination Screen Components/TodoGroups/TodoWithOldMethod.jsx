const fetchTodos = () => {
    retrieveAlTodosAPI(userToken, reducerVisitorID).then(function (val) {
      console.log("retrieving fetchTodos aPi", val);
      if (val) {
        if (val.data) {
          var info = val.data;

          console.log("retrieving fetchTodos aPi", info);
          // for (var key in info) {
          //   var i = Object.keys(info).indexOf(key);
          //   console.log("Index:" + i);

          //   var configurations = JSON.parse(info[key].configurations);
          //   console.log("Test Confid:" + configurations);
          //   if (configurations != null) {
          //     const postCardImageVal = {
          //       documentID: configurations.pictureDocumentID,
          //     };

          //     const postcardsVal = {
          //       name: info[key].name,
          //       description: info[key].description,
          //       base64: null,
          //       searchable: info[key].searchable,
          //       pk: info[key].pk,
          //       documentID: postCardImageVal.documentID,
          //     };

          //     postcardArrayData.push(postcardsVal);
          //     dispatch({
          //       type: "SET_POSTCARDS_DATA",
          //       postcardsData: postcardArrayData,
          //     });

          //     if (
          //       postCardImageVal.documentID != null ||
          //       postCardImageVal.documentID != ""
          //     ) {
          //       getImageByDocumentId(postCardImageVal.documentID, i, 5);
          //     }
          //   } else if (val.status == UNAUTH_KEY) {
          //     console.log("Setting to 0");
          //     localStorage.setItem("user-info-token", 0);
          //     dispatch({
          //       type: "SET_USER_TOKEN",
          //       reducerUserToken: 0,
          //     });
          //   }
          // }
        }
        // dispatch({
        //   type: "SET_POSTCARDS_DATA",
        //   postcardsData: postcardArrayData,
        // });
      }
    });
  };



  const fetchTodoGroupItems = (todoGroupKey, singleFetch = false) => {
    TodoItemsService.readTodoItems(todoGroupKey).then(function (val) {
      console.log("retrieving todoGroup aPi", val);
      if (val) {
        if (val.data) {
          var info = val.data;

          console.log("retrieving PostCards aPi", info);
          // for (var key in info) {
          //   var i = Object.keys(info).indexOf(key);
          //   console.log("Index:" + i);

          //   var configurations = JSON.parse(info[key].configurations);
          //   console.log("Test Confid:" + configurations);
          //   if (configurations != null) {
          //     const postCardImageVal = {
          //       documentID: configurations.pictureDocumentID,
          //     };

          //     const postcardsVal = {
          //       name: info[key].name,
          //       description: info[key].description,
          //       base64: null,
          //       searchable: info[key].searchable,
          //       pk: info[key].pk,
          //       documentID: postCardImageVal.documentID,
          //     };

          //     postcardArrayData.push(postcardsVal);
          //     dispatch({
          //       type: "SET_POSTCARDS_DATA",
          //       postcardsData: postcardArrayData,
          //     });

          //     if (
          //       postCardImageVal.documentID != null ||
          //       postCardImageVal.documentID != ""
          //     ) {
          //       getImageByDocumentId(postCardImageVal.documentID, i, 5);
          //     }
          //   } else if (val.status == UNAUTH_KEY) {
          //     console.log("Setting to 0");
          //     localStorage.setItem("user-info-token", 0);
          //     dispatch({
          //       type: "SET_USER_TOKEN",
          //       reducerUserToken: 0,
          //     });
          //   }
          // }
        }
        // dispatch({
        //   type: "SET_POSTCARDS_DATA",
        //   postcardsData: postcardArrayData,
        // });
      }
    });
    // setIsTodoGroupItemsFetching((prev) => ({
    //   ...prev,
    //   [todoGroupKey]: true,
    // }));

    // try {
    //   // const response = await readTodoItemAPI(todoGroupKey);
    //   const response = TodoItemsService.readTodoItems(todoGroupKey);
    //   const fetchedTodoGroupItems = response.data;

    //   console.log("fetchedTodoGroupItems key", todoGroupKey);
    //   console.log("fetchedTodoGroupItems", response);

    //   let finalTodoGroupItems = [];
    //   for (let key in fetchedTodoGroupItems) {
    //     finalTodoGroupItems.push(fetchedTodoGroupItems[key]);
    //   }

    //   setIsTodoGroupItemsFetching((prev) => ({
    //     ...prev,
    //     [todoGroupKey]: false,
    //   }));

    //   if (singleFetch) {
    //     return setTodoGroupItems((prev) => ({
    //       ...prev,
    //       [todoGroupKey]: finalTodoGroupItems,
    //     }));
    //   }

    //   return {
    //     [todoGroupKey]: finalTodoGroupItems,
    //   };
    // } catch (error) {
    //   setIsTodoGroupItemsFetching((prev) => ({
    //     ...prev,
    //     [todoGroupKey]: false,
    //   }));
    //   setTodoGroupItemsError((prev) => ({
    //     ...prev,
    //     [todoGroupKey]: error.message,
    //   }));
    // }
  };