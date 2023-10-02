import html2canvas from 'html2canvas';
import {canvastoFile, downloadFile, EImageType} from 'image-conversion';
// import { uploadBytes } from "firebase/storage";
// import { storageRef } from "services/firebase";

export async function takeSnapshot(username) {
  // const canvas = await html2canvas(document.querySelector('html'), {
  //   allowTaint: true,
  //   imageTimeout: 0,
  // });
  //
  // const fileName = `${username}_${new Date().toISOString()}.jpeg`;
  //
  // const file = await canvastoFile(canvas, 0.92, EImageType.JPEG);
  //
  // downloadFile(file, fileName);
  //
  // setTimeout(async () => {
  //   try {
  //     const ref = storageRef(`${username}/${fileName}`);
  //     const metadata = {
  //       contentType: EImageType.JPEG,
  //     };
  //     await uploadBytes(ref, file, metadata);
  //   } catch(e) {
  //     console.warn('Save to cloud failed', e)
  //   }
  // }, 0)
}
