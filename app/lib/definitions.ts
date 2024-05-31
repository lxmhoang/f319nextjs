
// https://liveboard.cafef.vn/
export type CompanyRTInfo = {
  code: string; //a 
  thamChieu: number; //b
  maxPrice: number; //c
  minPrice: number; //d

  muagia3Price: number; //e
  muagia3Volume: number; //f
  muagia2Price: number; //g
  muagia2Volume: number; //h
  muagia1Price: number; //i
  muagia1Volume: number; //j

  khoplenhTangGiam: number; //k
  khoplenhPrice: number; //l 
  khoplenhVolume: number; //m
  khoplenhTotalVolume: number; //n


  bangia1Price: number; //o
  bangia1Volume: number; //p
  bangia2Price: number; //q
  bangia2Volume: number; //r
  bangia3Price: number; //s 
  bangia3Volume: number; //t

  u: number; //u

  khoplenhMax: number; //v
  khoplenhMin: number; //w


  nuocngoaiBuy: number; //x
  nuocngoaiSell: number; //y

  z: number; //z 
  time: string;
  tb: number;
  ts: number;


}




export type APIResponse<T = object> = { success: true; data: T } | { success: false; error: string };