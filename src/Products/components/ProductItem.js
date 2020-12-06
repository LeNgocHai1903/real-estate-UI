import React, { useContext, useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UIElements/ErrorModal";

const ProductItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const history = useHistory();
  const auth = useContext(AuthContext);

  const style = {
    display: "inline-block",
    height: "38px",
    padding: "0 20px",
    color: "#555",
    textAlign: "center",
    fontSize: "10px",
    fontWeight: "600",
    lineHeight: "38px",
    letterSpacing: "0.1rem",
    textTransform: "uppercase",
    textDecoration: "none",
    whiteSpace: "nowrap",
    backgroundColor: "transparent",
    borderRadius: "4px",
    border: "1px solid #bbb",
    boxSizing: "border-box",
  };


  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/products/submit/${props.id}/${auth.userId}`,
        "PATCH",
        JSON.stringify({
          status: "1",
        }),
        {
          "Content-Type": "application/json",
        }
      );
      // history.push("/" + auth.userId + "/submit");
      // window.location.href=`/${auth.userId}/submit`
    } catch (error) {}
  };
  const onDeleteHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/products/${props.id}`,
        "DELETE"
      );
      history.push("/" + auth.userId + "/submit");
    } catch (error) {}
  };

  // const OnLikeHandler = async () => {
  //   if (!auth.isLoggedIn) {
  //     alert("Vui lòng đăng nhập trước khi sử dụng chức năng này!!!");
  //   } else {
  //     let check = props.like.find((el) => el === auth.userId);
  //     console.log(check);
  //     if (check) {
  //       setLoadedLike(props.like.length - 1);
  //       // event.preventDefault();
  //       try {
  //         await sendRequest(
  //           `http://localhost:5000/api/products/removelike/${props.id}/${auth.userId}`,
  //           "DELETE"
  //         );
  //         alert("Unliked!");
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     } else {
  //       setLoadedLike(props.like.length + 1);
  //       console.log(loadedLike);
  //       try {
  //         // event.preventDefault();
  //         await sendRequest(
  //           `http://localhost:5000/api/products/like/${props.id}/${auth.userId}`,
  //           "PATCH"
  //         );
  //         alert("Liked");
  //       } catch (error) {
  //         alert(error)
  //       }
  //     }
  //   }
  // };

  const onViewHandler = async (event) => {
    try {
      await sendRequest(
        `http://localhost:5000/api/products/view/${props.id}`,
        "PATCH"
      );
      event.preventDefault();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      {/* <ErrorModal
        error={error}
        onClear={clearError}
        style={{ marginBottom: "20px" }}
      /> */}

      {!isLoading && (
        <div className="col-lg-4">
          <div className="single-property">
            <div className="images">
              <img
                style={{ height: "400px", width: "400px" }}
                className="img-fluid mx-auto d-block"
                src={`http://localhost:5000/${props.img}`}
                alt=""
              />
              {/* <span>For Sale</span> */}
            </div>

            <div className="desc">
              <div className="top d-flex justify-content-between">
                <h4 style={{height:"62px"}}>
                  <a>{props.title}</a>
                </h4>
              </div>
              <div>
                <div className="d-flex justify-content-start">
                  <p>
                    Giá:{" "}
                    {props.price
                      .toFixed(0)
                      .replace(".", ",")
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                    {props.currentcy}{" "}
                  </p>
                </div>
                <p>Thể Loại: {props.productType}</p>
              </div>
              <div style={{ color: "red" }}>Diện tích: {props.area} m2</div>
              <div> Quận: {props.address.district} </div>
              <div> Thành Phố: {props.address.city} </div>
              <div style={{ fontSize: "14px", color: "green" }}>
                {" "}
                Ngày đăng: {props.date}
              </div>
              {/* <div style={{ fontSize: "14px", color: "red" }}>
                {" "}
                Hết hạn: {props.enddate}
              </div> */}
              <div style={{ textAlign: "center" }}>
                <Link to={`/${props.id}/details`}>
                  <p onClick={onViewHandler}> Click vào đây để xem chi tiết</p>
                </Link>

                {auth.isAdmin && (
                  <div>
                    <button
                      type="button"
                      class="btn btn-success"
                      onClick={onSubmitHandler}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger"
                      onClick={onDeleteHandler}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <div className="bottom d-flex justify-content-start">
                <label style={style}>
                  <i
                    className="far fa-heart fa-lg"
                    style={{ color: "red" }}
                  ></i>{" "}
                  {props.like.length} Lượt thích
                </label>
                <label style={style}>
                  <i className="lnr lnr-eye"></i> {props.views} Lượt xem
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ProductItem;