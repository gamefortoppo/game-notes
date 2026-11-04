// =============================================================
//  DỮ LIỆU GHI CHÚ – chỉ cần sửa file này
// =============================================================
//  Viết thao tác trong rotation bằng ký hiệu:
//    "E"  "E giữ"  "Q"  "BA"  "BA x2"  "CA"  "CA giữ"  "Nhảy"  "Lướt"
//  Thêm " x2", " x3"... để ghi số lần.
//  Ảnh: dán URL vào icon. Bỏ trống thì hiện chữ cái đầu tên.
//  element: pyro / hydro / electro / cryo / anemo / geo / dendro
//  weapon:  sword / claymore / polearm / bow / catalyst
// =============================================================

const ACTIONS = {
  "E":      { label: "Kỹ năng nguyên tố",            type: "skill" },
  "E giữ":  { label: "Giữ kỹ năng nguyên tố",        type: "skill" },
  "Q":      { label: "Kỹ năng nộ",                   type: "burst" },
  "BA":     { label: "Đánh thường (Basic Attack)",   type: "basic" },
  "CA":     { label: "Trọng kích (Charged Attack)",  type: "charged" },
  "CA giữ": { label: "Giữ trọng kích liên tục",      type: "charged" },
  "Nhảy":   { label: "Nhảy",                         type: "move" },
  "Lướt":   { label: "Lướt / né",                    type: "move" },
};

// Ảnh lấy từ genshin-impact.fandom.com (Character/List)
const IMG = "https://static.wikia.nocookie.net/gensin-impact/images/";

const ELEMENTS = {
  pyro:    { name: "Hỏa",   icon: IMG + "e/e8/Element_Pyro.png/revision/latest" },
  hydro:   { name: "Thủy",  icon: IMG + "3/35/Element_Hydro.png/revision/latest" },
  electro: { name: "Lôi",   icon: IMG + "7/73/Element_Electro.png/revision/latest" },
  cryo:    { name: "Băng",  icon: IMG + "8/88/Element_Cryo.png/revision/latest" },
  anemo:   { name: "Phong", icon: IMG + "a/a4/Element_Anemo.png/revision/latest" },
  geo:     { name: "Nham",  icon: IMG + "4/4a/Element_Geo.png/revision/latest" },
  dendro:  { name: "Thảo",  icon: IMG + "f/f4/Element_Dendro.png/revision/latest" },
};

const WEAPONS = {
  sword:    { name: "Kiếm đơn", icon: IMG + "9/95/Weapon-class-sword-icon.png/revision/latest" },
  claymore: { name: "Đại kiếm", icon: IMG + "5/51/Weapon-class-claymore-icon.png/revision/latest" },
  polearm:  { name: "Vũ khí cán dài", icon: IMG + "9/91/Weapon-class-polearm-icon.png/revision/latest" },
  bow:      { name: "Cung",     icon: IMG + "9/97/Weapon-class-bow-icon.png/revision/latest" },
  catalyst: { name: "Pháp khí", icon: IMG + "0/02/Weapon-class-catalyst-icon.png/revision/latest" },
};

const CHARACTERS = [
  {
    id: "mavuika",
    name: "Mavuika",
    title: "Hỏa Thần",
    rarity: 5,
    element: "pyro",
    weapon: "claymore",
    role: "Main DPS",
    region: "Natlan",
    icon: IMG + "d/da/Mavuika_Icon.png/revision/latest",

    summary:
      "Main DPS Hỏa. Kỹ năng nộ không dùng năng lượng mà dùng điểm Chiến Ý, tích từ việc cả đội tiêu hao Dạ Hồn.",

    skills: [
      {
        key: "E",
        name: "Red-Burning Stride",
        desc: "Bấm đầu trận để tiêu hao Dạ Hồn, vào trạng thái Dạ Hồn Chúc Phúc. Gắn ấn Hỏa từ off-field và bắt đầu tích Chiến Ý.",
      },
      {
        key: "Q",
        name: "Hour of Burning Skies",
        desc: "Dùng khi thanh Chiến Ý đầy (đồng đội Natlan tiêu hao Dạ Hồn hoặc nhận sát thương). Vào trạng thái Deathly Fire Crucible, tăng mạnh sát thương đòn đánh.",
      },
      {
        key: "CA",
        name: "Trọng kích / Đánh thường",
        desc: "Sau Q, đứng sân xả sát thương: giữ trọng kích xoay liên tục, hoặc đánh thường kết hợp nhảy bằng mô tô.",
      },
    ],

    teams: [
      {
        name: "Tan Chảy (Melt)",
        members: ["mavuika", "xilonen", "bennett", "citlali"],
        video: { title: "Mavuika combo guide from basic to advanced – NDC Impact", url: "" },
        rotation: [
          { char: "mavuika", actions: ["E"],
            why: "Tiêu hao Dạ Hồn, kích hoạt ấn Hỏa từ off-field." },
          { char: "xilonen", actions: ["E", "BA x2"],
            why: "Giảm kháng nguyên tố của quái và kích buff thánh di vật. Có thể dùng Q nếu cần hồi máu." },
          { char: "bennett", actions: ["Q"],
            why: "Tạo vùng hồi máu và buff tấn công lớn. Có thể dùng E trước Q." },
          { char: "citlali", actions: ["E", "Q"],
            why: "E tạo khiên. Q có ấn Băng mạnh (2U), xóa ấn Hỏa của Bennett và liên tục gắn lại ấn Băng lên quái." },
          { char: "mavuika", actions: ["Q"],
            why: "Bấm Q ngay khi vừa đổi ra.",
            warn: "Nếu chậm tay, E off-field của Mavuika (từ bước 1) sẽ nổ trúng quái và cướp mất ấn Băng, khiến Tan Chảy bị lỗi." },
          { char: "mavuika", actions: ["CA giữ"],
            why: "Xả sát thương cho đến khi hết thời gian cường hóa." },
        ],
      },
    ],

    build: {
      stats: [
        { label: "Tỉ lệ chí mạng", target: "~60%",
          note: "Bộ 4 Bí Điển Obsidian cho thêm 40%, đạt 100%." },
        { label: "Hiệu quả nạp", target: "Không cần", bad: true,
          note: "Q dùng Chiến Ý, không dùng năng lượng. Đừng chọn dòng phụ hay vũ khí tăng nạp." },
      ],
      artifacts: [
        { set: "Bí Điển Obsidian", pieces: 4, note: "+40% tỉ lệ chí mạng." },
      ],
      mainStats: { sands: "", goblet: "", circlet: "" },
      weapons: [],
    },

    notes: [],
  },

  // ---- Nhân vật phụ: điền thêm build / rotation sau ----
  { id: "xilonen", name: "Xilonen", rarity: 5, element: "geo",  weapon: "sword",    role: "Support", region: "Natlan",
    icon: IMG + "a/ab/Xilonen_Icon.png/revision/latest" },
  { id: "bennett", name: "Bennett", rarity: 4, element: "pyro", weapon: "sword",    role: "Support", region: "Mondstadt",
    icon: IMG + "7/79/Bennett_Icon.png/revision/latest" },
  { id: "citlali", name: "Citlali", rarity: 5, element: "cryo", weapon: "catalyst", role: "Support", region: "Natlan",
    icon: IMG + "d/dd/Citlali_Icon.png/revision/latest" },
];
