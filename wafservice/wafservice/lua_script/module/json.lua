local _M = {}

_M.json = nil

function _M.import_cjson()
    _M.json = require 'cjson'
end

if pcall( _M.import_cjson ) ~= true then
    _M.json = require 'dkjson'
end

return _M.json
