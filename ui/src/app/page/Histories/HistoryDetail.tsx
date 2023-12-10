import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { closeLoading, openLoading, showToastMessage } from "../../../redux/reducers";
import { scheduleApi } from "../../../api";
import { toastType } from "../../model/enum/common";

function HistoryDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(openLoading());
    scheduleApi.getDetail(id)
    .then((result: any) => {
      if (result.isSuccess) { 
        console.log(result.data);
      }
    })
    .catch(() => {
      dispatch(
        showToastMessage({
          message: "Có lỗi, hãy thử lại",
          type: toastType.error,
        })
      );
    })
    .finally(() => {
      dispatch(closeLoading());
    });

  }, [])

  return (  
    <>
    HistoryDetail
    </>
  );
}

export default HistoryDetail;