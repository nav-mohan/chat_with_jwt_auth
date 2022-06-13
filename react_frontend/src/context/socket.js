import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { socketAuthPath } from "../config";
import { socketNonAuthPath } from "../config";
import { nodeBaseUrl } from "../config";

export const socket = io.connect(nodeBaseUrl,{path:socketNonAuthPath});
export const SocketContext = React.createContext();