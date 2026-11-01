import onnxruntime as o,numpy as np,cv2,glob,os
from ai_edge_litert.interpreter import Interpreter
so=o.SessionOptions();so.intra_op_num_threads=4
s=o.InferenceSession('/tmp/claude-0/-home-user-mavastudio/32f96eaa-0f57-5fa5-a747-12ac3f307959/scratchpad/imgly/models/medium.onnx',so,providers=['CPUExecutionProvider'])
it=Interpreter('/tmp/claude-0/-home-user-mavastudio/32f96eaa-0f57-5fa5-a747-12ac3f307959/scratchpad/mp/package/selfie_segmentation.tflite');it.allocate_tensors()
i=it.get_input_details()[0];oo=it.get_output_details()[0]
for p in sorted(glob.glob('/tmp/claude-0/-home-user-mavastudio/32f96eaa-0f57-5fa5-a747-12ac3f307959/scratchpad/src/*.png')):
    out='/tmp/claude-0/-home-user-mavastudio/32f96eaa-0f57-5fa5-a747-12ac3f307959/scratchpad/mask/'+os.path.basename(p)
    if os.path.exists(out): continue
    im=cv2.imread(p)[:,:,::-1];H,W=im.shape[:2]
    x=cv2.resize(im,(1024,1024),interpolation=cv2.INTER_AREA).astype(np.float32);x=((x-128)/256).transpose(2,0,1)[None]
    a=cv2.resize(s.run(['output'],{'input':x})[0][0,0],(W,H))
    y=cv2.resize(im,(256,256),interpolation=cv2.INTER_AREA).astype(np.float32)/255.
    it.set_tensor(i['index'],y[None]);it.invoke();b=it.get_tensor(oo['index'])[0,...,0]
    b=cv2.resize(b,(W,H),interpolation=cv2.INTER_CUBIC)
    np.save(out.replace('.png','.npy'),np.stack([a,b]).astype(np.float16))
    cv2.imwrite(out,np.zeros((1,1),np.uint8))
