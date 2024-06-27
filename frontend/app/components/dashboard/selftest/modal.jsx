import React from "react";

const Modal = ({
  deviceId,
  deviceName,
  selfTest,
  closeModal,
  testingStatus,
}) => {
  return (
    <dialog id={deviceId} className="modal" open={true}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Fire Alarm Protection Self Test</h3>
        <p>
          Self test <strong>{deviceName}</strong> !
        </p>
        <div className="modal-action">
          <form method="dialog" className="">
            <div className="flex gap-2">
              {testingStatus && (
                <button
                  type="button"
                  className="btn btn-outline btn-accent"
                  onClick={() => selfTest(deviceId)}
                >
                  Test
                </button>
              )}
              {!testingStatus && (
                <button type="button" className="btn btn-accent text-white">
                  <div className="size-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="size-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="size-2 bg-white rounded-full animate-bounce"></div>
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline btn-error"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
