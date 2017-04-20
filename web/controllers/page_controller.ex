defmodule PFA.PageController do
  use PFA.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
