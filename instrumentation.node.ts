import { setDefaultResultOrder } from 'node:dns'
import { setDefaultAutoSelectFamily } from 'node:net'

// Neon advertises IPv4 and IPv6 addresses. In environments without working
// IPv6 routes, Node's automatic multi-address connection can time out even
// though the IPv4 endpoint is healthy. Keep PostgreSQL connections on IPv4.
setDefaultResultOrder('ipv4first')
setDefaultAutoSelectFamily(false)
