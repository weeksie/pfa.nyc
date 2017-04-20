defmodule PFA.Project do
  use PFA.Web, :model

  schema "projects" do
    field :name, :string
    field :description, :string
    field :image, :string
    field :url, :string

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :description, :image, :url])
    |> validate_required([:name, :description, :image, :url])
  end
end
