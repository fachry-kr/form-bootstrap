import Swal from "sweetalert2";

const ReactSwal = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-primary me-2",
    cancelButton: "btn btn-secondary",
  },
  buttonsStyling: false,
});

export default ReactSwal;
