import React from 'react';
import File from './File';

const Svg = ({ color = '#FFB400', ...props }) => (
  <File {...props}>
    <path
      fill={color}
      fillRule="evenodd"
      d="M6.75698 23.3835c-.0936.0595-.2088.0951-.3456.1079-.1368.0117-.2736.0304-.4104.0549-.0648.0105-.1278.025-.189.0443-.0612.0198-.1152.0461-.162.0787-.0468.0339-.0834.077-.1104.1313-.027.0548-.0408.1202-.0408.1972 0 .0665.0198.1225.0594.168.0396.0455.087.081.1428.1073.0564.0262.1176.0449.1842.0554.066.0105.1266.0152.1806.0152.0684 0 .1422-.0082.2214-.0257.0792-.0175.1542-.0472.2244-.0892.0702-.042.1284-.0957.1752-.1605.0468-.0647.0702-.144.0702-.2385v-.4463zm.6156.756c0 .0735.0102.126.0294.1569.0198.0321.0588.0473.117.0473h.0642c.0252 0 .054-.0029.0864-.0099v.4147c-.0216.007-.0498.0146-.0834.0233-.0348.0094-.0696.017-.1056.024-.036.007-.072.0116-.108.0157-.036.0035-.0666.0053-.0918.0053-.126 0-.2304-.0245-.3126-.0735-.0834-.049-.1374-.1348-.1626-.2573-.1224.1155-.2724.1989-.4506.252-.1788.0525-.3504.0788-.516.0788-.126 0-.2466-.0164-.3618-.0502-.1152-.0333-.2166-.0823-.3054-.147-.0876-.0642-.1578-.147-.21-.2468-.0522-.0997-.0786-.2158-.0786-.3488 0-.168.0318-.3045.0942-.4095.0636-.105.1458-.1872.2484-.2467s.2184-.1027.3456-.129c.1278-.0262.2568-.046.3864-.0606.1116-.0204.2178-.0356.3186-.0444.1008-.0081.1902-.0233.2676-.0443.0768-.021.1386-.0537.183-.0974.045-.0438.0678-.1091.0678-.1966 0-.077-.0192-.14-.0564-.189-.0384-.049-.0852-.0863-.141-.1126-.0552-.0262-.1176-.0443-.186-.0525-.0678-.0093-.1332-.014-.1938-.014-.1728 0-.3156.0356-.4272.1056-.1116.07-.1746.1785-.189.3255h-.6156c.0108-.175.054-.3202.1296-.4357.0756-.1155.1722-.2083.2892-.2783.1164-.07.249-.119.3966-.147.1476-.028.2988-.042.4536-.042.1368 0 .2718.014.405.042.1332.028.2532.0735.3594.1359.1056.0636.1914.1447.2562.2444.0648.0998.0972.2217.0972.3646v1.3971zM10.6235 24.7433h-.6048v-.378h-.0108c-.07556.1365-.18836.2456-.33776.3278-.1494.0823-.3018.1237-.4566.1237-.3666 0-.6318-.0881-.7962-.2654-.1638-.1768-.2454-.4433-.2454-.8003v-1.722h.615v1.6642c0 .2374.0474.406.141.5034.0936.098.225.147.3942.147.1296 0 .2376-.0186.324-.0571.0864-.0391.1566-.0899.2106-.1552.054-.0648.0924-.1423.1158-.2333.0234-.091.03536-.189.03536-.294v-1.575h.6156v2.7142zM11.8868 23.4149c0 .1155.015.2298.0462.3412.0306.112.0774.2118.1404.2993.063.0875.1434.1575.24.21.0972.0525.2124.0787.3456.0787.1374 0 .255-.028.354-.084.099-.0554.18-.1289.243-.2205.063-.091.1098-.1936.1404-.3068.03-.1137.0462-.2304.0462-.3494 0-.301-.0696-.5355-.2082-.7035-.1386-.168-.327-.252-.564-.252-.1446 0-.2658.0286-.3648.0869-.099.0578-.1806.133-.243.2258-.0636.0927-.108.1977-.135.315-.0276.1172-.0408.2368-.0408.3593zm2.1492 1.3282h-.5832v-.3675h-.0102c-.0834.1575-.204.2701-.3624.339-.1578.0682-.3258.102-.5022.102-.2196 0-.411-.0373-.5748-.1125-.1638-.0753-.3-.178-.4074-.3075-.1086-.1295-.1896-.2829-.2436-.459-.0534-.1768-.0804-.3664-.0804-.57 0-.245.0336-.4567.1026-.6352.0684-.1785.159-.3255.2724-.441.1134-.1155.243-.2007.3888-.2543.1458-.0543.294-.0817.4452-.0817.087 0 .1746.0082.2652.0239.0894.0152.1764.0408.2586.0758.0828.035.1596.08.2298.1336.0702.0543.1284.119.1752.1925h.0114v-1.386h.615v3.7479zM14.8571 24.7433h.615V22.029h-.615v2.7143zm0-3.1815h.615v-.567h-.615v.567zM17.5569 24.344c.1368 0 .2556-.028.3564-.084.1008-.0555.1836-.129.2484-.22.0648-.0915.1122-.1942.1428-.3074.0306-.1137.0462-.2298.0462-.3488 0-.1161-.0156-.2316-.0462-.3465-.0306-.1155-.078-.2182-.1428-.308-.0648-.0887-.1476-.1616-.2484-.2176-.1008-.0554-.2196-.084-.3564-.084-.1374 0-.2556.0286-.3564.084-.1008.056-.1836.1289-.2484.2176-.0648.0898-.1122.1925-.1434.308-.0306.1149-.0456.2304-.0456.3465 0 .119.015.2351.0456.3488.0312.1132.0786.2159.1434.3074.0648.091.1476.1645.2484.22.1008.056.219.084.3564.084zm0 .473c-.2232 0-.4224-.0361-.5964-.1079-.1752-.0717-.3222-.1709-.4428-.2969-.1212-.126-.213-.2759-.2754-.4509-.0636-.1756-.0948-.3681-.0948-.5775 0-.2071.0312-.3973.0948-.5728.0624-.175.1542-.3255.2754-.451.1206-.126.2676-.2251.4428-.2969.174-.0717.3732-.1079.5964-.1079.2232 0 .4218.0362.5964.1079.1746.0718.3222.1709.4428.2969.1212.1255.2124.276.2754.451.063.1755.0948.3657.0948.5728 0 .2094-.0318.4019-.0948.5775-.063.175-.1542.3249-.2754.4509-.1206.126-.2682.2252-.4428.2969-.1746.0718-.3732.1079-.5964.1079zM14.397 16.224c-.723 0-1.203-.294-1.203-.4882 0-.1943.48-.4883 1.203-.4883.723 0 1.203.294 1.203.4883 0 .1942-.48.4882-1.203.4882zm-4.79398 1.2478c-.723 0-1.203-.294-1.203-.4883 0-.1942.48-.4882 1.203-.4882.72298 0 1.20298.294 1.20298.4882 0 .1943-.48.4883-1.20298.4883zm6.48778-6.933c-.0684-.056-.1578-.0787-.2478-.0624l-4.794 1.1194c-.141.0269-.243.147-.243.287v4.2951c-.3156-.1645-.7296-.266-1.20298-.266-1.0278 0-1.803.4609-1.803 1.0716 0 .6113.7752 1.0716 1.803 1.0716 1.02778 0 1.80298-.4603 1.80298-1.0716v-4.8597l4.194-1.0075v3.8139c-.3156-.1651-.7296-.266-1.203-.266-1.0278 0-1.803.4602-1.803 1.0716 0 .6107.7752 1.0715 1.803 1.0715s1.803-.4608 1.803-1.0715v-4.9724c0-.0869-.0402-.1691-.1092-.2246z"
      clipRule="evenodd"
    />
  </File>
);

export default Svg;
