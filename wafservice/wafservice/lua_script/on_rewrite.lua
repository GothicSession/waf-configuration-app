local util = require "util"
local WafServiceConfig = require "WafServiceConfig"
local scheme_lock = require "scheme_lock"
local redirect = require "redirect"
local uri_rewrite = require "uri_rewrite"

if ngx.var.vn_exec_flag and ngx.var.vn_exec_flag ~= '' then
    util.ngx_ctx_load()
    return
end

--At first , make sure every request use latest running config
WafServiceConfig.update_config()

scheme_lock.run()
redirect.run()
uri_rewrite.run()
