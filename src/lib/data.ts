// Look data — testing with real catalog images.
// supabaseId fields are populated after running:
//   node scripts/seed.mjs
//   node scripts/update-look-ids.mjs

export type Product = {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  supabaseId?: string;
};

export type Look = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  products: Product[];
};

export const looks: Look[] = [
  {
    id: "1",
    imageUrl:
      "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/2025/NOVEMBER/17/lf6lK1sl_ed345735c5524156ad21082b447db55c.jpg",
    title: "Look 1",
    description: "Curated look from selected brands",
    products: [
      {
        id: "p1",
        name: "sneakers",
        brand: "Diesel",
        imageUrl:
          "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/SEPTEMBER/17/pvpQ7k7w_27ae04204d644720b6837871ec94f122.jpg",
        supabaseId: "8f325b8c-9340-43c2-b923-aa3d2c86b7d3",
      },
      {
        id: "p2",
        name: "jeans",
        brand: "Diesel",
        imageUrl:
          "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/SEPTEMBER/8/pURoJbb2_3db19d111a564d8498eb7307665ff66d.jpg",
        supabaseId: "4ed69729-6d33-4258-a208-83bb99a69183",
      },
      {
        id: "p3",
        name: "sweatshirt",
        brand: "Ajio",
        imageUrl:
          "https://assets-jiocdn.ajio.com/medias/sys_master/root/20230526/pMNH/64709f37d55b7d0c63164fd4/-473Wx593H-441589755-khaki-MODEL.jpg",
        supabaseId: "c4a07526-9566-478b-9e63-6716bbce5dee",
      },
    ],
  },
  {
    id: "2",
    imageUrl:
      "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2026/FEBRUARY/16/QHYMRvXA_fd7769761479409da6ec0d739ebe8260.jpg",
    title: "Look 2",
    description: "Casual summer vibes",
    products: [
      {
        id: "p4",
        name: "sweatshirt",
        brand: "Myntra",
        imageUrl:
          "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/NOVEMBER/18/1Xp9Ooqq_f08604536f5247739d0f8cbdd5a4d75d.jpg",
        supabaseId: "9cf1f63d-cb9c-4248-a40a-c3e5d8e391d0",
      },
      {
        id: "p5",
        name: "shorts",
        brand: "Myntra",
        imageUrl:
          "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/JULY/23/1EZzNwTB_16f257b233e84405800954fd426aed52.jpg",
        supabaseId: "b15e2914-14ee-4f22-8a3e-1151eb0604a8",
      },
      {
        id: "p6",
        name: "shoes",
        brand: "Myntra",
        imageUrl:
          "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/JANUARY/23/N7zqhNCS_71525c68bf344223b01960115be11781.jpg",
        supabaseId: "2cc9ed7f-2792-4ed3-94f6-b74bb456d6b9",
      },
    ],
  },
];