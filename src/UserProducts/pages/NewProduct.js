import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/FormElements/Input";
import Button from "../../shared/FormElements/Button";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/FormElements/ImageUpload";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_PRICE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./ProductForm.css";

import { data } from "../../city";

const NewPlace = () => {
  const auth = useContext(AuthContext);

  const [productType, setProductType] = useState("Chung cư");
  const [city, setCity] = useState("Hồ Chí Minh");
  const [district, setDistrict] = useState("1");
  const [currentcy, setCurrentcy] = useState("Triệu");

  //Sử dụng form đã được custom để nhận những giá trị được nhập dưới Input
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: [
        {
          street: {
            value: "",
            isValid: false,
          },
          district: {
            value: "",
            isValid: false,
          },
          city: {
            value: "",
            isValid: false,
          },
        },
      ],
      price: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
      area: {
        value: "",
        isValid: false,
      },
      productType: {
        value: productType,
        isValid: false,
      },
      currentcy: {
        value: '',
        isValid: false,
      },

    },
    false
  );

  const TypeChange = (e) => {
    setProductType(e.target.value);
  };
  const cityChange = (e) => {
    setCity(e.target.value);
  };

  const districtChange= e => {
    setDistrict(e.target.value);
  }

  const currentcyChange= e => {
    setCurrentcy(e.target.value);
  }

  let options = data.filter((o) => {
    if (o.value === city) return (o.district);
  });

  const history = useHistory();

  //Submit sản phẩm lên database
  const productSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("street", formState.inputs.street.value);
      formData.append("city", city);
      formData.append("creator", auth.userId);
      formData.append("price", formState.inputs.price.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("area", formState.inputs.area.value);
      formData.append("district", district);
      formData.append("productType", productType);
      formData.append("currentcy", currentcy);
      await sendRequest("http://localhost:5000/api/products", "POST", formData);
      alert("Bạn đã đăng bài thành công. Hãy chờ Admin kiểm duyệt để được lên trang chủ nhé!")
      history.push("/");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form
        className="place-form"
        onSubmit={productSubmitHandler}
        style={{ marginTop: "70px" }}
      >
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Tiêu đề"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Vui lòng nhập tên tiêu đề"
          onInput={inputHandler}
        />
        <br />
        <br />
        <form>
          <h4>Thể loại</h4>
          <select onChange={TypeChange} value={productType} className="form-control"
                        style={{fontFamily: "Cursive"}}>
            <option value="Chung cư">Chung cư</option>
            <option value="Căn hộ">Căn hộ</option>
            <option value="Nhà ở">Nhà ở</option>
          </select>
        </form>
        <br />
        <br />
        <Input
          id="description"
          element="textarea"
          label="Mô tả"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Vui lòng nhập mô tả tối thiếu 5 từ"
          onInput={inputHandler}
        />
        <br />
        <br />
        <br />
        <Input
          id="area"
          element="input"
          label="Diện tích (m2)"
          validators={[VALIDATOR_PRICE()]}
          errorText="Vui lòng nhập diện tích"
          onInput={inputHandler}
        />
        <br />
        <br />
        <Input
          id="price"
          element="input"
          label="Giá bán(VND)"
          validators={[VALIDATOR_PRICE()]}
          errorText="Vui lòng nhập giá tiền"
          onInput={inputHandler}
        />
        <br />
        <br />
        <form>
          <h4>Đơn vị tiền</h4>
          <select onChange={currentcyChange} value={currentcy} className="form-control"
                        style={{fontFamily: "Cursive"}}>
            <option value="Triệu">Triệu</option>
            <option value="Tỉ">Tỉ</option>
          </select>
        </form>
        <br />
        <br />
        <form>
          <h4>Thành Phố</h4>
          <select onChange={cityChange} value={city} className="form-control"
                        style={{fontFamily: "Cursive"}}>
            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </select>
        </form>
        <br />
        <br />
        <form>
          <h4>Quận</h4>
          <select onChange={districtChange} value={district} className="form-control"
                        style={{fontFamily: "Cursive"}}>
          {options[0].district.map((d) => {
            return <option value={d.name}>{d.name}</option>;
          })}
          </select>
        </form>
        <br />
        <br />
        <Input
          id="street"
          element="input"
          label="Đường"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Vui lòng nhập tên đường"
          onInput={inputHandler}
        />
        <br />
        <br />
        <br /> <br />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Vui lòng lựa hình ảnh"
        />
        <br />
        <br />
        <Button type="submit">ĐĂNG BÀI</Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
